<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('name_de')->nullable()->after('name');
            $table->string('short_description_de')->nullable()->after('short_description');
            $table->longText('description_de')->nullable()->after('description');
            $table->string('price_label_de')->nullable()->after('price_label');
        });

        Schema::table('navigation_items', function (Blueprint $table) {
            $table->string('label_de')->nullable()->after('label');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['name_de', 'short_description_de', 'description_de', 'price_label_de']);
        });

        Schema::table('navigation_items', function (Blueprint $table) {
            $table->dropColumn('label_de');
        });
    }
};
