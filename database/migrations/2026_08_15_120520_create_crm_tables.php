<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('company')->nullable();
            $table->string('job_title')->nullable();
            $table->string('website')->nullable();
            $table->string('address_line')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable()->default('Sri Lanka');
            $table->string('status')->default('lead'); // lead, prospect, active, inactive, vip
            $table->string('source')->nullable(); // website, referral, walk_in, social, other
            $table->unsignedTinyInteger('priority')->default(3); // 1 high - 5 low
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('lifetime_value', 14, 2)->default(0);
            $table->json('tags')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('last_contacted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_code')->unique();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('photo')->nullable();
            $table->string('department')->nullable();
            $table->string('job_title')->nullable();
            $table->string('employment_type')->default('full_time'); // full_time, part_time, contract, intern
            $table->string('role')->default('staff'); // super_admin, manager, content_manager, sales, support, staff
            $table->json('permissions')->nullable();
            $table->date('hired_at')->nullable();
            $table->string('status')->default('active'); // active, on_leave, suspended, terminated
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('emergency_contact')->nullable();
            $table->text('bio')->nullable();
            $table->decimal('salary', 14, 2)->nullable();
            $table->json('social_links')->nullable();
            $table->boolean('show_on_website')->default(false);
            $table->timestamps();
        });

        Schema::create('crm_notes', function (Blueprint $table) {
            $table->id();
            $table->string('notable_type'); // customer, employee, order, quote
            $table->unsignedBigInteger('notable_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('note'); // note, call, email, meeting, task
            $table->string('title')->nullable();
            $table->text('body');
            $table->boolean('is_pinned')->default(false);
            $table->timestamp('remind_at')->nullable();
            $table->timestamps();

            $table->index(['notable_type', 'notable_id']);
        });

        Schema::create('crm_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type'); // created, status_changed, order_placed, quote_requested, note_added, assigned, contacted
            $table->string('subject_type')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('user_id')->constrained('customers')->nullOnDelete();
        });

        Schema::table('quote_requests', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('id')->constrained('customers')->nullOnDelete();
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->foreignId('customer_id')->nullable()->after('id')->constrained('customers')->nullOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('department')->nullable()->after('phone');
            $table->string('job_title')->nullable()->after('department');
            $table->foreignId('employee_id')->nullable()->after('job_title')->constrained('employees')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('employee_id');
            $table->dropColumn(['department', 'job_title']);
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropConstrainedForeignId('customer_id');
        });

        Schema::table('quote_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('customer_id');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('customer_id');
        });

        Schema::dropIfExists('crm_activities');
        Schema::dropIfExists('crm_notes');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('customers');
    }
};
